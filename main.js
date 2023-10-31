import "./style.css";
import "./src/styles/header.scss";
import "./src/styles/ip-infos.scss";
import arrowForm from "./src/assets/icon-arrow.svg";
import iconLocation from "./src/assets/icon-location.svg"
import { getIpData } from "./src/fetch";
import { getMyIP } from "./src/ipFetch";

const myIcon = L.icon({
  iconUrl: iconLocation,
  iconSize: [46, 56],
  iconAnchor: [46, 70],
  popupAnchor: [-25, -35],
});

let map = null;
let marker = null;

const renderApp = () => {
  document.querySelector("#app").innerHTML = `<header class="header">
  <h1>IP Address Tracker</h1>
  <form data-js="search-form">
    <div class="input-container">
      <input type="text" name="ip-adress" placeholder="Search for any IP address or domain">
      <button type="submit" class="search-btn"><img src="${arrowForm}" /></button>
    </div>
  </form>
  </header>
  <section class="section hidden">
  <ul>
    <li>
      <span>IP Address</span>
      <strong data-js="ip-text"></strong>
    </li>
    <li>
      <span>Location</span>
      <div data-js="location-text"></div>
    </li>
    <li>
      <span>Timezone</span>
      <strong data-js="timezone-text"></strong>
    </li>
    <li>
      <span>ISP</span>
      <strong data-js="isp-text"></strong>
    </li>
  </ul>
</section>
<div id="map"></div>
`;

  const searchForm = document.querySelector("[data-js='search-form']");
  const ipTextContainer = document.querySelector("[data-js='ip-text']");
  const locationTextContainer = document.querySelector(
    "[data-js='location-text']"
  );
  const timezoneTextContainer = document.querySelector(
    "[data-js='timezone-text']"
  );
  const ispTexttContainer = document.querySelector("[data-js='isp-text']");

  return [
    searchForm,
    ipTextContainer,
    locationTextContainer,
    timezoneTextContainer,
    ispTexttContainer,
  ];
};

export const [
  searchForm,
  ipTextContainer,
  locationTextContainer,
  timezoneTextContainer,
  ispTextContainer,
] = renderApp();

const renderDataIntoDOM = async (ipAddress) => {
  const { ip, isp, location } = await getIpData(ipAddress);

  ipTextContainer.textContent = ip;
  locationTextContainer.innerHTML = `<p>${location.city}, </p><p>${location.region}</p>`;
  timezoneTextContainer.textContent = `UTC ${location.timezone}`;
  ispTextContainer.textContent = isp;

  showIpLocationInMap(location, ip);
  showIpAddressData();
};

const showIpLocationInMap = (location, ip) => {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.setView([location.lat, location.lng]);
  marker = L.marker([location.lat, location.lng], { icon: myIcon }).addTo(map);
  marker.bindPopup(
    `IP Address: <b>${ip}</b><br>Location: <b>${location.city}</b>`
  );
};

const showIpAddressData = () => {
  const ipAddressDate = document.querySelector(".section");

  if (ipAddressDate.classList.contains("hidden")) {
    ipAddressDate.classList.remove("hidden");
  }
};

const searchIpAddressData = async (e) => {
  e.preventDefault();
  const inputValue = e.target["ip-adress"].value;
  const isValidIp = /^((1?\d{1,2}|2([0-4]\d|5[0-5]))\.){3}(1?\d{1,2}|2([0-4]\d|5[0-5]))$|^$/
    .test(inputValue);

  if (isValidIp) {
    renderDataIntoDOM(inputValue);
    e.target.reset();
    return;
  }

  alert("Ip Address Invalid!!!");
};

window.onload = async () => {
  const { ip } = await getMyIP();

  map = L.map("map").setView([37.40599, -122.078514], 17);
  map.zoomControl.remove();
  renderDataIntoDOM(ip);
};

searchForm.addEventListener("submit", searchIpAddressData);
