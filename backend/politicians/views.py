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


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Party List View
class PartyListView(generics.ListAPIView):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    search_fields = ['name', 'short_name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']  # Default alphabetical ordering


# Party Detail View
class PartyDetailView(generics.RetrieveAPIView):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


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


class PoliticianDetailView(generics.RetrieveAPIView):
    queryset = Politician.objects.all()
    serializer_class = PoliticianDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


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
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new rating
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, politician=politician)
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

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own rating.")
        instance.delete()