from rest_framework import serializers
from politicians.models import Party, Politician, Rating
from django.db.models import Avg


class PartySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Party
        fields = '__all__'


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
        

class PoliticianDetailSerializer(serializers.ModelSerializer):
    party_name = serializers.CharField(source='party.name', read_only=True)
    class Meta:
        model = Politician
        fields = [
            "name", "slug", "photo", "views", "age", "education",
            "criminal_record", "party_name", "party_position", "criticism",
            "location", "biography", "previous_party_history", "is_active", "average_rating"
        ]