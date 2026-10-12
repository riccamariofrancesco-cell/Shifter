package com.shifter.mock

import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationManager
import android.os.SystemClock
import android.provider.Settings
import kotlinx.coroutines.flow.MutableStateFlow

/** Stato della posizione fittizia mostrato nella UI. */
sealed interface MockStatus {
    /** Nessuna posizione fittizia in corso. */
    data object Disabled : MockStatus

    /** Il servizio sta inviando la posizione fittizia. */
    data class Active(val latitude: Double, val longitude: Double) : MockStatus

    /** Qualcosa non va (es. app non selezionata nelle Opzioni sviluppatore). */
    data class Error(val message: String) : MockStatus
}

/** Stato condiviso tra servizio e Activity (stesso processo). */
object MockLocationState {
    val status = MutableStateFlow<MockStatus>(MockStatus.Disabled)
}

/** Wrapper sulle API ufficiali di LocationManager per le posizioni fittizie (test provider). */
object MockLocationHelper {

    private val PROVIDERS = arrayOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)

    /**
     * Registra i test provider. Lancia SecurityException se l'app non è
     * selezionata come "app per posizioni fittizie" nelle Opzioni sviluppatore.
     */
    fun addProviders(lm: LocationManager) {
        for (provider in PROVIDERS) {
            removeProvider(lm, provider)
            lm.addTestProvider(
                provider,
                false, // requiresNetwork
                false, // requiresSatellite
                false, // requiresCell
                false, // hasMonetaryCost
                true,  // supportsAltitude
                true,  // supportsSpeed
                true,  // supportsBearing
                Criteria.POWER_LOW,
                Criteria.ACCURACY_FINE
            )
            lm.setTestProviderEnabled(provider, true)
        }
    }

    fun removeProviders(lm: LocationManager) {
        for (provider in PROVIDERS) removeProvider(lm, provider)
    }

    fun pushLocation(lm: LocationManager, latitude: Double, longitude: Double) {
        for (provider in PROVIDERS) {
            val location = Location(provider).apply {
                this.latitude = latitude
                this.longitude = longitude
                altitude = 0.0
                accuracy = 1f
                speed = 0f
                bearing = 0f
                time = System.currentTimeMillis()
                elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
            }
            lm.setTestProviderLocation(provider, location)
        }
    }

    /**
     * Verifica che l'app possa davvero impostare posizioni fittizie.
     * Ritorna null se tutto ok, altrimenti lo stato di errore da mostrare.
     */
    fun checkAvailability(context: Context): MockStatus.Error? {
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return try {
            val provider = LocationManager.GPS_PROVIDER
            removeProvider(lm, provider)
            lm.addTestProvider(
                provider, false, false, false, false, true, true, true,
                Criteria.POWER_LOW, Criteria.ACCURACY_FINE
            )
            removeProvider(lm, provider)
            null
        } catch (e: Exception) {
            MockStatus.Error(describeError(context, e))
        }
    }

    fun describeError(context: Context, e: Exception): String =
        if (e is SecurityException) {
            val devOptionsOn = Settings.Global.getInt(
                context.contentResolver, Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0
            ) != 0
            context.getString(
                if (devOptionsOn) R.string.err_not_mock_app else R.string.err_dev_options_off
            )
        } else {
            e.message ?: e.javaClass.simpleName
        }

    private fun removeProvider(lm: LocationManager, provider: String) {
        try {
            lm.removeTestProvider(provider)
        } catch (_: IllegalArgumentException) {
            // il test provider non esisteva ancora
        }
    }
}
