import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, X, Truck, UserPlus } from "lucide-react";
import Swal from "sweetalert2";

var TransportModal = function ({ isOpen, onClose, dispatchIds }) {
  var [transportTypes, setTransportTypes] = useState([]);
  var [providers, setProviders] = useState([]);
  var [vehicles, setVehicles] = useState([]);
  var [drivers, setDrivers] = useState([]);
  var [selectedTransportType, setSelectedTransportType] = useState("");
  var [selectedProvider, setSelectedProvider] = useState("");
  var [selectedVehicle, setSelectedVehicle] = useState("");
  var [selectedDriver, setSelectedDriver] = useState("");
  var [destination, setDestination] = useState("");
  var [bookingExpense, setBookingExpense] = useState("");
  var [travelExpense, setTravelExpense] = useState("");
  var [loading, setLoading] = useState({
    transportTypes: false,
    providers: false,
    vehicles: false,
    drivers: false,
    submitting: false,
  });
  var [showProviderForm, setShowProviderForm] = useState(false);
  var [showVehicleForm, setShowVehicleForm] = useState(false);
  var [showDriverForm, setShowDriverForm] = useState(false);
  var [providerForm, setProviderForm] = useState({
    provider_name: "",
    address: "",
    mobile: "",
  });
  var [vehicleForm, setVehicleForm] = useState({
    vehicle_name: "",
    vehicle_model: "",
    vehicle_number: "",
  });
  var [driverForm, setDriverForm] = useState({
    driver_name: "",
    driver_mobile: "",
    driver_address: "",
  });

  // Fetch transport types
  var fetchTransportTypes = async function () {
    try {
      setLoading((prev) => ({ ...prev, transportTypes: true }));
      var response = await axios.get("http://localhost:5000/material/transport-types");
      setTransportTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transport types:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load transport types. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, transportTypes: false }));
    }
  };

  // Fetch providers based on transport type
  var fetchProviders = async function (transport_type_id) {
    try {
      setLoading((prev) => ({ ...prev, providers: true }));
      var response = await axios.get("http://localhost:5000/material/providers", {
        params: { transport_type_id },
      });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load providers. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  };

  // Fetch vehicles
  var fetchVehicles = async function () {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      var response = await axios.get("http://localhost:5000/material/vehicles");
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load vehicles. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, vehicles: false }));
    }
  };

  // Fetch drivers
  var fetchDrivers = async function () {
    try {
      setLoading((prev) => ({ ...prev, drivers: true }));
      var response = await axios.get("http://localhost:5000/material/drivers");
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load drivers. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }));
    }
  };

  // Handle provider form submission
  var handleProviderSubmit = async function (e) {
    e.preventDefault();
    try {
      var response = await axios.post("http://localhost:5000/material/add-provider", {
        ...providerForm,
        transport_type_id: selectedTransportType,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Provider added successfully!",
      });
      setProviders((prev) => [...prev, response.data.data]);
      setProviderForm({ provider_name: "", address: "", mobile: "" });
      setShowProviderForm(false);
      setSelectedProvider(response.data.data.id);
    } catch (error) {
      console.error("Error adding provider:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add provider. Please try again.",
      });
    }
  };

  // Handle vehicle form submission
  var handleVehicleSubmit = async function (e) {
    e.preventDefault();
    try {
      var response = await axios.post("http://localhost:5000/material/add-vehicle", vehicleForm);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Vehicle added successfully!",
      });
      setVehicles((prev) => [...prev, response.data.data]);
      setVehicleForm({ vehicle_name: "", vehicle_model: "", vehicle_number: "" });
      setShowVehicleForm(false);
      setSelectedVehicle(response.data.data.id);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add vehicle. Please try again.",
      });
    }
  };

  // Handle driver form submission
  var handleDriverSubmit = async function (e) {
    e.preventDefault();
    try {
      var response = await axios.post("http://localhost:5000/material/add-driver", driverForm);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Driver added successfully!",
      });
      setDrivers((prev) => [...prev, response.data.data]);
      setDriverForm({ driver_name: "", driver_mobile: "", driver_address: "" });
      setShowDriverForm(false);
      setSelectedDriver(response.data.data.id);
    } catch (error) {
      console.error("Error adding driver:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add driver. Please try again.",
      });
    }
  };

  // Handle transport form submission
  var handleTransportSubmit = async function (e) {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      var transportData = dispatchIds.map((dispatch_id) => ({
        dispatch_id,
        provider_id: selectedProvider,
        destination,
        vehicle_id: selectedVehicle,
        driver_id: selectedDriver,
        booking_expense: bookingExpense ? parseFloat(bookingExpense) : null,
        travel_expense: parseFloat(travelExpense),
      }));

      for (var data of transportData) {
        await axios.post("http://localhost:5000/material/add-transport", data);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Transport details added successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Error adding transport:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add transport details. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Effect hooks
  useEffect(
    function () {
      if (isOpen) {
        fetchTransportTypes();
        fetchVehicles();
        fetchDrivers();
      }
    },
    [isOpen]
  );

  useEffect(
    function () {
      if (selectedTransportType) {
        fetchProviders(selectedTransportType);
      } else {
        setProviders([]);
        setSelectedProvider("");
      }
    },
    [selectedTransportType]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Assign Transport Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Transport Form */}
        <form onSubmit={handleTransportSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Transport Type</label>
              <select
                value={selectedTransportType}
                onChange={(e) => setSelectedTransportType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Transport Type</option>
                {transportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
              </select>
              {loading.transportTypes && <Loader2 className="animate-spin mt-2" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Provider</label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={!selectedTransportType}
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.provider_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowProviderForm(true)}
                  className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                >
                  <UserPlus size={20} />
                </button>
              </div>
              {loading.providers && <Loader2 className="animate-spin mt-2" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle</label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_name} ({vehicle.vehicle_number})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowVehicleForm(true)}
                  className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                >
                  <Truck size={20} />
                </button>
              </div>
              {loading.vehicles && <Loader2 className="animate-spin mt-2" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Driver</label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.driver_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowDriverForm(true)}
                  className="mt-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
                >
                  <UserPlus size={20} />
                </button>
              </div>
              {loading.drivers && <Loader2 className="animate-spin mt-2" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Expense</label>
              <input
                type="number"
                value={bookingExpense}
                onChange={(e) => setBookingExpense(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Travel Expense</label>
              <input
                type="number"
                value={travelExpense}
                onChange={(e) => setTravelExpense(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                step="0.01"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            disabled={loading.submitting}
          >
            {loading.submitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Truck className="mr-2" />
                Save Transport Details
              </>
            )}
          </button>
        </form>

        {/* Provider Form */}
        {showProviderForm && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Add New Provider</h3>
            <form onSubmit={handleProviderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider Name</label>
                <input
                  type="text"
                  value={providerForm.provider_name}
                  onChange={(e) => setProviderForm((prev) => ({ ...prev, provider_name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={providerForm.address}
                  onChange={(e) => setProviderForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="text"
                  value={providerForm.mobile}
                  onChange={(e) => setProviderForm((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Provider
                </button>
                <button
                  type="button"
                  onClick={() => setShowProviderForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicle Form */}
        {showVehicleForm && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Name</label>
                <input
                  type="text"
                  value={vehicleForm.vehicle_name}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, vehicle_name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                <input
                  type="text"
                  value={vehicleForm.vehicle_model}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, vehicle_model: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <input
                  type="text"
                  value={vehicleForm.vehicle_number}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, vehicle_number: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowVehicleForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Driver Form */}
        {showDriverForm && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Add New Driver</h3>
            <form onSubmit={handleDriverSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input
                  type="text"
                  value={driverForm.driver_name}
                  onChange={(e) => setDriverForm((prev) => ({ ...prev, driver_name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="text"
                  value={driverForm.driver_mobile}
                  onChange={(e) => setDriverForm((prev) => ({ ...prev, driver_mobile: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={driverForm.driver_address}
                  onChange={(e) => setDriverForm((prev) => ({ ...prev, driver_address: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Driver
                </button>
                <button
                  type="button"
                  onClick={() => setShowDriverForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportModal;