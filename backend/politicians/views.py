from rest_framework import viewsets, permissions
from politicians.models import Politician, Rating
from politicians.serializers import PoliticianDetailSerializer, PoliticianSerializer, RatingSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from politicians.models import Politician, Rating
from politicians.serializers import RatingSerializer



class PoliticianViewSet(viewsets.ModelViewSet):
    queryset = Politician.objects.all()
    serializer_class = PoliticianSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PoliticianDetailSerializer
        return super().get_serializer_class()


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'politician_ratings']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        politician_id = request.data.get('politician')
        
        if not politician_id:
            return Response(
                {'error': 'politician_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # check if politician exists
        try:
            politician = Politician.objects.get(id=politician_id)
        except Politician.DoesNotExist:
            return Response(
                {'error': f'Politician with id {politician_id} does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # check if user already rated this politician
        existing_rating = Rating.objects.filter(
            politician=politician,
            user=request.user
        ).first()
        
        if existing_rating:
            # update existing rating
            serializer = self.get_serializer(existing_rating, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        
        # create new rating
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        rating = self.get_object()
        if rating.user != request.user:
            return Response(
                {'error': 'You can only delete your own ratings'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        rating = self.get_object()
        if rating.user != request.user:
            return Response(
                {'error': 'You can only update your own ratings'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def politician_ratings(self, request):
        politician_id = request.query_params.get('politician_id')
        
        if not politician_id:
            return Response(
                {'error': 'politician_id query parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            politician = Politician.objects.get(id=politician_id)
        except Politician.DoesNotExist:
            return Response(
                {'error': f'Politician with id {politician_id} does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # get all ratings for the politician, ordered by most recent
        ratings = Rating.objects.filter(politician=politician).order_by('-created_at')
        
        # Pagination
        page = self.paginate_queryset(ratings)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_ratings(self, request):
        ratings = Rating.objects.filter(user=request.user).order_by('-created_at')
        
        page = self.paginate_queryset(ratings)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)
