from django.contrib import admin
from politicians.models import Politician, Party, Rating


admin.site.register(Politician)
admin.site.register(Party)
admin.site.register(Rating)

admin.site.site_header = "NetaBase"
admin.site.site_title = "NetaBase"
admin.site.index_title = "Welcome to the NetaBase Admin Dashboard"