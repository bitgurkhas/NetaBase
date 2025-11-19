from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from news_api.services import scrape_all_sources


class PoliticsNewsAPIView(APIView):
    permission_classes = [AllowAny]
    @method_decorator(cache_page(60 * 60))
    def get(self, request):
        data = scrape_all_sources()
        return Response({
            "count": len(data),
            "results": data
        })
