from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.response import Response

from ..serializers import TypingSessionSerializer
from fyp.utils.word_generation import generate_words_for_user


# For saving typing sessions
class TypingSessionCreateView(generics.CreateAPIView):
    serializer_class = TypingSessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# For getting word List
class GetWordView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request) -> Response:
        mode = request.query_params.get("mode")

        if mode not in ['random', 'adaptive']:
            return Response({"error": "Invalid mode parameter."}, status=400)

        if mode == 'adaptive':
            if not request.user.is_authenticated:
                return Response({"error": "Authenticaton required for adaptive mode."}, status=403)

            # Generates words based on users past experience
            word_batch = generate_words_for_user(request.user)
        else:

            print("reached this!")
            # Random words generated or invalid fallback
            word_batch = generate_words_for_user(None)

        # Adds the mode to the settings
        word_batch["settings"]["mode"] = mode

        return Response(word_batch)