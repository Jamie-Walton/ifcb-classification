from django.db import models
from django.contrib.auth.models import User

class Preferences(models.Model):
    SORTS = models.TextChoices('SortOption', 'AZ ZA LS SL')
    LOADS = models.TextChoices('LoadOption', 'recent edited')

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    sort = models.CharField(max_length=2, default='AZ', choices=SORTS.choices)
    scale = models.DecimalField(default='0.560', max_digits=5, decimal_places=3)
    load = models.CharField(max_length=6, default='recent', choices=LOADS.choices)
    phytoguide = models.BooleanField(default=True)

    class Meta:
        ...
        permissions = (("is_lab_user", "Can access lab classifying"), \
                        ("is_public_user", "Can access public classifying"))
