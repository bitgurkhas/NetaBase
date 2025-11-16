from django.urls import path
from .views import get_ratopati_politics

urlpatterns = [
    path("ratopati-politics/", get_ratopati_politics),
]
