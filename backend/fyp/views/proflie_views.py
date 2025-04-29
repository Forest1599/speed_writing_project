from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from fyp.models import TypingSession
from django.db.models import Avg, Max, Count

class ProfileStatsView(APIView):
    # Ensure only authenticated users can access this endpoint
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Retrieve all typing sessions for the current user
        sessions = TypingSession.objects.filter(user=user)

        def aggregate_stats(qs):
            """
            Aggregates statistics for a given queryset of TypingSessions.
            If no sessions exist, returns zeros.
            """
            count = qs.count()
            if count == 0:
                return {
                    "average_wpm": 0,
                    "average_accuracy": 0,
                    "highest_wpm": 0,
                    "total_sessions": 0,
                }

            return {
                "average_wpm": round(qs.aggregate(Avg('wpm'))['wpm__avg'], 2),
                "average_accuracy": round(qs.aggregate(Avg('accuracy'))['accuracy__avg'], 2),
                "highest_wpm": qs.aggregate(Max('wpm'))['wpm__max'],
                "total_sessions": count,
            }

        # Aggregate overall stats for all sessions
        all_stats = aggregate_stats(sessions)
        # Aggregate stats for random mode sessions only
        random_stats = aggregate_stats(sessions.filter(mode="random"))
        # Aggregate stats for adaptive mode sessions only
        adaptive_stats = aggregate_stats(sessions.filter(mode="adaptive"))

        # Get the 30 most recent adaptive sessions for WPM history
        adaptive_sessions = TypingSession.objects.filter(user=user, mode="adaptive")\
            .order_by('-timestamp')[:30].values('timestamp', 'wpm')
        adaptive_wpm_history = [
            {
                'date': session['timestamp'].strftime('%Y-%m-%d'),
                'wpm': session['wpm']
            } for session in list(adaptive_sessions)[::-1]  # Reverse to chronological order
        ]

        # Get the 30 most recent random sessions for WPM history
        random_sessions = TypingSession.objects.filter(user=user, mode="random")\
            .order_by('-timestamp')[:30].values('timestamp', 'wpm')
        random_wpm_history = [
            {
                'date': session['timestamp'].strftime('%Y-%m-%d'),
                'wpm': session['wpm']
            } for session in list(random_sessions)[::-1]  # Reverse to chronological order
        ]

        # Return the structured stats and recent history
        return Response({
            "username": user.username,
            "joined": user.date_joined.strftime('%Y-%m-%d'),
            "overall": all_stats,
            "random": random_stats,
            "adaptive": adaptive_stats,
            "adaptive_wpm_history": adaptive_wpm_history,
            "random_wpm_history": random_wpm_history
        })