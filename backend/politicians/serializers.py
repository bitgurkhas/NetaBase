from rest_framework import serializers
from politicians.models import Party, Politician, Rating, Initiatives, Promises
from django.db.models import Avg


class PartySerializer(serializers.ModelSerializer):
    politician_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Party
        fields = [
            'id',
            'name',
            'slug',
            'short_name',
            'flag',
            'politician_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_politician_count(self, obj):
        return obj.politicians.filter(is_active=True).count()

class PoliticianSerializer(serializers.ModelSerializer):
    party_name = serializers.CharField(source='party.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    rated_by = serializers.SerializerMethodField()
    class Meta:
        model = Politician
        fields = ["slug", "name", "photo", "age", "party_name", "average_rating", "rated_by", "views"]

    def get_average_rating(self, obj):
        avg = Rating.objects.filter(politician=obj).aggregate(avg=Avg('score'))['avg']
        return round(avg, 2) if avg is not None else 0

    def get_rated_by(self, obj):
        count = Rating.objects.filter(politician=obj).count()
        return count
        
        
class RatingSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Rating
        fields = ['id', 'user_id', 'username', 'score', 'comment', 'created_at', 'updated_at']
        

class InitiativesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Initiatives
        fields = ["title", "description"]


class PromisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promises
        fields = ["title", "description", "status"]


class PoliticianDetailSerializer(serializers.ModelSerializer):
    party_name = serializers.CharField(source='party.name', read_only=True)

    initiatives = InitiativesSerializer(many=True, read_only=True)
    promises = PromisesSerializer(many=True, read_only=True)

    class Meta:
        model = Politician
        fields = [
            "name", "slug", "photo", "views", "age", "education",
            "criminal_record", "party_name", "party_position", "criticism",
            "location", "biography", "previous_party_history", "is_active",
            "average_rating", "initiatives", "promises"
        ]
