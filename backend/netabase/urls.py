from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.http import HttpResponse

schema_view = get_schema_view(
    openapi.Info(
        title="Smart Governance API",
        default_version='v1',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)


def ping_server(request):
    return HttpResponse("pong")


urlpatterns = [
    path('ping/', ping_server, name="ping"),
    
    path('admin/', admin.site.urls),
    path('api/', include('user_api.urls')),
    path('api/', include('politicians.urls')),
    path('api/news/', include('news_api.urls')),
    
    
    # Swagger and ReDoc routes
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc-ui'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
