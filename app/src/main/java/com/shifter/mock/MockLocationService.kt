package com.shifter.mock

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.location.LocationManager
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat

/**
 * Servizio in primo piano che reinvia ogni secondo la posizione fittizia,
 * così continua a funzionare anche quando l'app è in background.
 */
class MockLocationService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var locationManager: LocationManager
    private var latitude = 0.0
    private var longitude = 0.0

    private val pushRunnable = object : Runnable {
        override fun run() {
            try {
                MockLocationHelper.pushLocation(locationManager, latitude, longitude)
                handler.postDelayed(this, INTERVAL_MS)
            } catch (e: Exception) {
                fail(e)
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        latitude = intent?.getDoubleExtra(EXTRA_LATITUDE, Double.NaN) ?: Double.NaN
        longitude = intent?.getDoubleExtra(EXTRA_LONGITUDE, Double.NaN) ?: Double.NaN

        try {
            ServiceCompat.startForeground(
                this, NOTIFICATION_ID, buildNotification(),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
            require(!latitude.isNaN() && !longitude.isNaN()) { "Coordinate mancanti" }

            handler.removeCallbacks(pushRunnable)
            MockLocationHelper.addProviders(locationManager)
            MockLocationHelper.pushLocation(locationManager, latitude, longitude)
            MockLocationState.status.value = MockStatus.Active(latitude, longitude)
            handler.postDelayed(pushRunnable, INTERVAL_MS)
        } catch (e: Exception) {
            fail(e)
        }
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(pushRunnable)
        MockLocationHelper.removeProviders(locationManager)
        if (MockLocationState.status.value is MockStatus.Active) {
            MockLocationState.status.value = MockStatus.Disabled
        }
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun fail(e: Exception) {
        MockLocationState.status.value = MockStatus.Error(MockLocationHelper.describeError(this, e))
        stopSelf() // onDestroy ripulisce i provider e non sovrascrive l'errore
    }

    private fun buildNotification(): Notification {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(
            NotificationChannel(
                CHANNEL_ID, getString(R.string.notification_channel), NotificationManager.IMPORTANCE_LOW
            )
        )
        val openApp = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText(getString(R.string.notification_text, latitude, longitude))
            .setContentIntent(openApp)
            .setOngoing(true)
            .build()
    }

    companion object {
        const val EXTRA_LATITUDE = "latitude"
        const val EXTRA_LONGITUDE = "longitude"
        private const val CHANNEL_ID = "mock_location"
        private const val NOTIFICATION_ID = 1
        private const val INTERVAL_MS = 1000L
    }
}
