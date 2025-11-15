from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Avg

from politicians.models import (
    Politician,
    Party,
    Rating,
    Initiatives,
    Promises,
)


# ---------- Inlines ----------
class RatingInline(admin.TabularInline):
    model = Rating
    extra = 0
    readonly_fields = ("user", "score", "comment", "created_at")
    fields = ("user", "score", "comment", "created_at")
    can_delete = False
    show_change_link = True


class InitiativesInline(admin.StackedInline):
    model = Initiatives
    extra = 0
    readonly_fields = ("created_at", "updated_at")


class PromisesInline(admin.TabularInline):
    model = Promises
    extra = 0
    fields = ("title", "status", "created_at")
    readonly_fields = ("created_at",)
    show_change_link = True


# ---------- Admin actions ----------
def make_active(modeladmin, request, queryset):
    updated = queryset.update(is_active=True)
    modeladmin.message_user(request, f"{updated} politician(s) marked active.")


make_active.short_description = "Mark selected politicians as active"


def make_inactive(modeladmin, request, queryset):
    updated = queryset.update(is_active=False)
    modeladmin.message_user(request, f"{updated} politician(s) marked inactive.")


make_inactive.short_description = "Mark selected politicians as inactive"


# ---------- Admin classes ----------
@admin.register(Politician)
class PoliticianAdmin(admin.ModelAdmin):
    list_display = (
        "photo_preview",
        "name",
        "party",
        "party_position",
        "is_active",
        "views",
        "average_rating_display",
        "created_at",
    )
    list_select_related = ("party",)
    search_fields = ("name", "party__name", "location", "party_position")
    list_filter = ("party", "is_active", "party_position")
    readonly_fields = ("views", "created_at", "updated_at", "photo_preview", "slug")

    fieldsets = (
        ("Basic", {"fields": ("name", "photo", "photo_preview", "party", "party_position", "is_active")} ),
        ("Profile", {"fields": ("age", "education", "location")}),
        ("Biography & Criticism", {"fields": ("biography", "criticism")}),
        ("History & Meta", {"fields": ("previous_party_history", "views", "created_at", "updated_at")} ),
    )
    inlines = (RatingInline, PromisesInline, InitiativesInline)
    actions = (make_active, make_inactive)
    list_per_page = 25
    save_on_top = True

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        return qs.annotate(_avg_rating=Avg("ratings__score"))

    def average_rating_display(self, obj):
        avg = getattr(obj, "_avg_rating", None)
        avg = round(avg, 2) if avg else 0
        total = obj.ratings.count() if hasattr(obj, "ratings") else 0
        return format_html("{} <span style='color: #999'>(from {} ratings)</span>", avg, total)

    average_rating_display.short_description = "Avg Rating"
    average_rating_display.admin_order_field = "_avg_rating"

    def photo_preview(self, obj):
        if obj.photo:
            return format_html(
                "<img src=\"{}\" style=\"max-height:60px;max-width:120px;border-radius:6px;\" />",
                obj.photo.url,
            )
        return "-"

    photo_preview.short_description = "Photo"


@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ("flag_preview", "name", "short_name", "created_at")
    search_fields = ("name", "short_name")
    readonly_fields = ("flag_preview", "slug", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    list_per_page = 25

    def flag_preview(self, obj):
        if obj.flag:
            return format_html(
                "<img src=\"{}\" style=\"max-height:40px;max-width:120px;border-radius:4px;\" />",
                obj.flag.url,
            )
        return "-"

    flag_preview.short_description = "Flag"


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("user", "politician", "score", "short_comment", "created_at")
    search_fields = ("user__username", "politician__name", "comment")
    list_filter = ("score", "created_at")
    readonly_fields = ("created_at", "updated_at")
    raw_id_fields = ("user", "politician")

    def short_comment(self, obj):
        if not obj.comment:
            return "-"
        return (obj.comment[:60] + "...") if len(obj.comment) > 60 else obj.comment

    short_comment.short_description = "Comment"


@admin.register(Initiatives)
class InitiativesAdmin(admin.ModelAdmin):
    list_display = ("title", "politician", "created_at")
    search_fields = ("title", "politician__name")
    list_filter = ("created_at",)
    raw_id_fields = ("politician",)


@admin.register(Promises)
class PromisesAdmin(admin.ModelAdmin):
    list_display = ("title", "politician", "status", "created_at")
    search_fields = ("title", "politician__name", "status")
    list_filter = ("status",)
    raw_id_fields = ("politician",)


admin.site.site_header = "NetaBase"
admin.site.site_title = "NetaBase Admin"
admin.site.index_title = "Welcome to the NetaBase Dashboard"

