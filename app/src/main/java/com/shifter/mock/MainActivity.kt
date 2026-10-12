package com.shifter.mock

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var latitudeInput: EditText
    private lateinit var longitudeInput: EditText
    private lateinit var statusText: TextView
    private lateinit var statusDetail: TextView
    private lateinit var startButton: Button
    private lateinit var stopButton: Button
    private lateinit var devOptionsButton: Button

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) {
            // Il permesso di notifica è facoltativo; quello di posizione serve per il servizio.
            if (hasLocationPermission()) {
                onStartClicked()
            } else {
                MockLocationState.status.value =
                    MockStatus.Error(getString(R.string.err_location_permission))
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        latitudeInput = findViewById(R.id.latitudeInput)
        longitudeInput = findViewById(R.id.longitudeInput)
        statusText = findViewById(R.id.statusText)
        statusDetail = findViewById(R.id.statusDetail)
        startButton = findViewById(R.id.startButton)
        stopButton = findViewById(R.id.stopButton)
        devOptionsButton = findViewById(R.id.devOptionsButton)

        startButton.setOnClickListener { onStartClicked() }
        stopButton.setOnClickListener { stopService(Intent(this, MockLocationService::class.java)) }
        devOptionsButton.setOnClickListener {
            startActivity(Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS))
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                MockLocationState.status.collect { render(it) }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // Se non è attiva, ricontrolla se l'app è selezionata nelle Opzioni sviluppatore.
        if (MockLocationState.status.value !is MockStatus.Active) {
            MockLocationState.status.value =
                MockLocationHelper.checkAvailability(this) ?: MockStatus.Disabled
        }
    }

    private fun onStartClicked() {
        val latitude = parseCoordinate(latitudeInput, 90.0) ?: return
        val longitude = parseCoordinate(longitudeInput, 180.0) ?: return

        if (!hasLocationPermission()) {
            val permissions = mutableListOf(Manifest.permission.ACCESS_FINE_LOCATION)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                permissions += Manifest.permission.POST_NOTIFICATIONS
            }
            permissionLauncher.launch(permissions.toTypedArray())
            return
        }

        // Il controllo crea/rimuove un test provider: non farlo mentre il servizio è attivo.
        if (MockLocationState.status.value !is MockStatus.Active) {
            MockLocationHelper.checkAvailability(this)?.let {
                MockLocationState.status.value = it
                return
            }
        }

        val intent = Intent(this, MockLocationService::class.java)
            .putExtra(MockLocationService.EXTRA_LATITUDE, latitude)
            .putExtra(MockLocationService.EXTRA_LONGITUDE, longitude)
        ContextCompat.startForegroundService(this, intent)
    }

    /** Legge e valida una coordinata; accetta sia il punto che la virgola decimale. */
    private fun parseCoordinate(input: EditText, limit: Double): Double? {
        val value = input.text.toString().trim().replace(',', '.').toDoubleOrNull()
        if (value == null || value < -limit || value > limit) {
            input.error = getString(R.string.err_invalid_coordinate, limit.toInt())
            input.requestFocus()
            return null
        }
        return value
    }

    private fun hasLocationPermission() =
        ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) ==
            PackageManager.PERMISSION_GRANTED

    private fun render(status: MockStatus) {
        when (status) {
            MockStatus.Disabled -> {
                statusText.text = getString(R.string.status_disabled)
                statusText.setTextColor(getColor(R.color.status_disabled))
                statusDetail.text = getString(R.string.status_disabled_detail)
            }
            is MockStatus.Active -> {
                statusText.text = getString(R.string.status_active)
                statusText.setTextColor(getColor(R.color.status_active))
                statusDetail.text =
                    getString(R.string.status_active_detail, status.latitude, status.longitude)
            }
            is MockStatus.Error -> {
                statusText.text = getString(R.string.status_error)
                statusText.setTextColor(getColor(R.color.status_error))
                statusDetail.text = status.message
            }
        }
        stopButton.isEnabled = status is MockStatus.Active
        devOptionsButton.visibility =
            if (status is MockStatus.Error) View.VISIBLE else View.GONE
    }
}
