from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from politicians.models import Party, Politician, Rating
from politicians.serializers import PartySerializer, RatingSerializer
from politicians.serializers import PoliticianSerializer, PoliticianDetailSerializer
from django.db.models import F
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.core.cache import cache
from django.conf import settings 

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


def clear_politician_cache(slug):
    cache.delete(f"politician:{slug}")
    
# Party List View
class PartyListView(generics.ListAPIView):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'short_name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# Party Detail View
class PartyDetailView(generics.RetrieveAPIView):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @method_decorator(cache_page(60 * 10))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    

# Politicians by Party View
class PartyPoliticiansView(generics.ListAPIView):
    serializer_class = PoliticianSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'biography', 'education', 'location', 'party_position']
    ordering_fields = ['name', 'age', 'created_at', 'views']
    ordering = ['-views']

    def get_queryset(self):
        party_slug = self.kwargs['slug']
        return Politician.objects.filter(party__slug=party_slug)


class PoliticianListView(generics.ListAPIView):
    queryset = Politician.objects.all()
    serializer_class = PoliticianSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filter by exact fields
    filterset_fields = ['party', 'party__slug', 'is_active', 'location']
    
    # Search across these fields
    search_fields = ['name', 'biography', 'education', 'party__name', 'location', 'party_position']
    
    # Allow ordering by these fields
    ordering_fields = ['name', 'age', 'created_at', 'views']
    ordering = ['-views']  # Default ordering by most viewed


    @method_decorator(cache_page(60 * 5))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

class PoliticianDetailView(generics.RetrieveAPIView):
    queryset = Politician.objects.all()
    serializer_class = PoliticianDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        slug = kwargs["slug"]
        cache_key = f"politician:{slug}"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        
        if not cached_data:
            # Cache miss - fetch from DB
            instance = self.get_object()
            cached_data = self.get_serializer(instance).data
            cache.set(cache_key, cached_data, settings.CACHE_TTL)
        
        # Increment views
        Politician.objects.filter(slug=slug).update(views=F('views') + 1)
        
        return Response(cached_data)
    

class PoliticianRatingListCreateView(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    authentication_classes = [JWTAuthentication]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    
    filterset_fields = ['score']
    ordering_fields = ['created_at', 'updated_at', 'score']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Rating.objects.filter(
            politician__slug=self.kwargs["slug"]
        ).select_related('user', 'politician')

    def create(self, request, *args, **kwargs):
        politician_slug = self.kwargs["slug"]
        politician = get_object_or_404(Politician, slug=politician_slug)
        
        # Check if user already rated
        existing = Rating.objects.filter(
            politician=politician,
            user=request.user
        ).first()
        
        if existing:
            # Update existing rating
            serializer = self.get_serializer(existing, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            clear_politician_cache(politician.slug)  # ← ADD THIS LINE
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new rating
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, politician=politician)
        clear_politician_cache(politician.slug)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PoliticianRatingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RatingSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Rating.objects.all()

    def perform_update(self, serializer):
        rating = self.get_object()
        if rating.user != self.request.user:
            raise PermissionDenied("You can only modify your own rating.")
        serializer.save()
        clear_politician_cache(rating.politician.slug)

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own rating.")
        clear_politician_cache(instance.politician.slug)
        instance.delete()