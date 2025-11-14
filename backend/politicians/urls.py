from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PoliticianViewSet, RatingViewSet

router = DefaultRouter()
router.register('politicians', PoliticianViewSet)
router.register('ratings', RatingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
