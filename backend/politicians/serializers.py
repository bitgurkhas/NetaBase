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
        fields = ["id", "name", "photo", "age", "party_name", "average_rating", "rated_by"]

    def get_average_rating(self, obj):
        avg = Rating.objects.filter(politician=obj).aggregate(avg=Avg('score'))['avg']
        return round(avg, 2) if avg is not None else 0

    def get_rated_by(self, obj):
        count = Rating.objects.filter(politician=obj).count()
        return count
        
class PoliticianDetailSerializer(serializers.ModelSerializer):
    party_name = serializers.CharField(source='party.name', read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Politician
        fields = '__all__'

    def get_average_rating(self, obj):
        avg = Rating.objects.filter(politician=obj).aggregate(avg=Avg('score'))['avg']
        return round(avg, 2) if avg is not None else 0


class RatingSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    politician_name = serializers.ReadOnlyField(source='politician.name')
    class Meta:
        model = Rating
        fields = ['id', 'politician', 'politician_name', 'user_id','username', 'score', 'comment', 'created_at', 'updated_at']