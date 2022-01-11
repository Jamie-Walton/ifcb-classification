from django.db import models
from django.contrib.auth.models import User

class Classifier(models.Model):
    SORTS = models.TextChoices('SortOption', 'AZ ZA LS SL')
    LOADS = models.TextChoices('LoadOption', 'recent edited')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    sort_preference = models.CharField(max_length=2, default='AZ', choices=SORTS.choices)
    scale_preference = models.DecimalField(default='0.560', max_digits=5, decimal_places=3)
    load_preference = models.CharField(max_length=6, default='recent', choices=LOADS.choices)
