from django.apps import AppConfig


class ClinicConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'clinic'
    verbose_name = 'Clinic Management'

    def ready(self):
        """
        Initialize signals and other setup when app is ready
        """
        import clinic.signals  # noqa
