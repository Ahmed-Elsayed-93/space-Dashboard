const API_KEY = "kxdBBpeegwqcsVNf16Uxg98GRjYwYjgMHHTMm1cx";
const apodDate = document.getElementById("apod-date");
const apodDateInput = document.getElementById("apod-date-input");
const apodImage = document.getElementById("apod-image");
const apodLoading = document.getElementById("apod-loading");
const apodTitle = document.getElementById("apod-title");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodDateInfo = document.getElementById("apod-date-info");
const apodMediaType = document.getElementById("apod-media-type");
const apodMediaImg = document.getElementById("apod-media");
const apodfllscreen = document.getElementById("apod-full-screen");
const apodfllscreenbtncontainer = document.getElementById(
  "full-screen-btn-container",
);

document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");

  if (!sidebarToggle || !sidebar) return;

  sidebarToggle.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    sidebar.classList.toggle("sidebar-open");
  });

  document.addEventListener("click", function (event) {
    if (
      window.innerWidth < 1024 &&
      sidebar.classList.contains("sidebar-open") &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target)
    ) {
      sidebar.classList.remove("sidebar-open");
    }
  });

  sidebar.querySelectorAll("a, button").forEach(function (item) {
    item.addEventListener("click", function () {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove("sidebar-open");
      }
    });
  });
});

async function getSpaceToday(selectedDate) {
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  if (selectedDate) {
    url += `&date=${selectedDate}`;
  }
  try {
    apodLoading.classList.remove("hidden");
    const response = await fetch(url);
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.log(error);
  } finally {
    apodLoading.classList.add("hidden");
  }
}
getSpaceToday();
function displayData(dataInfo) {
  let todayDate = new Date(dataInfo.date).toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  let customDate = new Date(dataInfo.date).toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  console.log(todayDate);
  apodDate.innerHTML = `Astronomy Picture of the Day - ${todayDate}`;
  apodDateInput.value = dataInfo.date;
  apodDateInput.max = dataInfo.date;
  apodDateInput.nextElementSibling.innerHTML = customDate;

  if (dataInfo.media_type === "image") {
    apodMediaImg.innerHTML = `
   <img src="${dataInfo.url} " class="w-full h-full" />
    `;
    apodfllscreenbtncontainer.classList.remove("hidden");
  }

  if (dataInfo.media_type === "video") {
    apodMediaImg.innerHTML = `
              <iframe src="${dataInfo.url}" class="w-full h-full"></iframe>
      `;
    apodfllscreenbtncontainer.classList.add("hidden");
  }
  apodTitle.innerHTML = dataInfo.title;
  apodExplanation.innerHTML = dataInfo.explanation;
  apodMediaType.innerHTML = dataInfo.media_type;
  apodDateDetail.innerHTML = dataInfo.date;
  apodCopyright.innerHTML = dataInfo.copyright
    ? `Copyright: ${dataInfo.copyright}`
    : "Copyright: Public Domain";

  apodDateInfo.innerHTML = dataInfo.date;

  apodfllscreen.addEventListener("click", function () {
    const img = apodMediaImg.querySelector("img");
    if (img) {
      img.requestFullscreen();
    }
  });
}
apodDateInput.addEventListener("change", function () {
  const selectedDate = this.value;

  if (!selectedDate) return;

  getSpaceToday(selectedDate);
});

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

let targetSection;
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    targetSection = link.getAttribute("data-section");
    console.log(targetSection);
    sections.forEach((section) => {
      if (section.getAttribute("data-section") == targetSection) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });
      link.classList.add("active");
    });
  });
});


async function getLaunch() {
  const response = await fetch(
    "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10",
  );
  const { results } = await response.json();
  console.log(results);

  displayFirstCard(results[0]);
  displayOtherCard(results.slice(1, 10));
}

getLaunch();

function displayFirstCard(object) {
  document.getElementById("featured-launch").innerHTML = `

  <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${object.status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${object.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${object.launch_service_provider.name} </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${object.rocket.configuration.name} </span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${getDaysUntilLaunch(object.net)} </p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${new Date(
                          object.net,
                        ).toLocaleString("en-us", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} </p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${new Date(
                          object.net,
                        ).toLocaleTimeString("en-us", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: "true",
                          timeZone: "UTC",
                        })} UTC</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${object.pad.location.name} </p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${object.pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                     ${object.mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <!-- Placeholder image/icon since we can't load external images reliably without correct URLs -->
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                    <img src="${object.image.image_url}" onerror="this.src='./assets/images/launch-placeholder.png'" class='w-full h-full'/>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

  `;
}

function getDaysUntilLaunch(date) {
  const currentDate = new Date();
  const launchDate = new Date(date);

  const diffTime = launchDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;

  console.log(diffDays);
}


function displayOtherCard(arr) {
  let cattoona = ``;
  for (let i = 0; i < arr.length; i++) {
    cattoona += `
      <div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                    <img src="${arr[i].image.image_url}" onerror="this.src='./assets/images/launch-placeholder.png'" class='w-full h-full'/>
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    Go
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                                         ${arr[i].name}

                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${arr[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${new Date(
                      arr[i].net,
                    ).toLocaleString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })} </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${new Date(
                      arr[i].net,
                    ).toLocaleTimeString("en-us", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: "true",
                      timeZone: "UTC",
                    })} UTC</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${arr[i].rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${arr[i].pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
    `;
  }
  document.getElementById("launches-grid").innerHTML = cattoona;
}


async function loadplants() {
  const res = await fetch(
    `https://solar-system-opendata-proxy.vercel.app/api/planets`,
  );
  const data = await res.json();

  console.log(data.bodies);

  displayplants(data.bodies);
}

loadplants();

const planetColors = {
  mercury: "#eab308",
  venus: "#f97316",
  earth: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#f59e0b",
  saturn: "#eab308",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};

function displayplants(plants) {
  let cartoona = ``;
  for (let i = 0; i < plants.length; i++) {
    cartoona += `
     <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${plants[i].id}"
              style="--planet-color: ${planetColors[plants[i].englishName.toLowerCase()]}"
              onmouseover="this.style.borderColor='${planetColors[plants[i].englishName.toLowerCase()]}'"
              onmouseout="this.style.borderColor='#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${plants[i].image} "
                  alt="Mercury"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${plants[i].englishName} </h4>
              <p class="text-xs text-slate-400 text-center">${(plants[i].semimajorAxis / 149597870.7).toFixed(2)} AU</p>
            </div>
    `;
  }

  document.getElementById("planets-grid").innerHTML = cartoona;

  document.querySelectorAll('.planet-card').forEach((plantCard) => {
    plantCard.addEventListener("click", function () {
      const plantId = plantCard.dataset.planetId;
      console.log(plantId);
   


      let plantObj = plants.find((plant) => plant.id == plantId);
      console.log(plantObj);

       document.getElementById('planet-info').innerHTML=`
           <div
             class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8"
           >
             <div
               class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0"
             >
               <div
                 class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6"
               >
                 <img
                   id="planet-detail-image"
                   class="w-full h-full object-contain"
                   src="${plantObj.image}"
                   alt="earth planet detailed realistic render with clouds and continents"
                 />
               </div>
               <div class="flex-1">
                 <div class="flex items-center justify-between mb-3 md:mb-4">
                   <h3
                     id="planet-detail-name"
                     class="text-2xl md:text-3xl font-space font-bold"
                   >
                     ${plantObj.englishName}
                   </h3>
                   <button
                     class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                   >
                     <i class="far fa-heart"></i>
                   </button>
                 </div>
                 <p
                   id="planet-detail-description"
                   class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
                 >
                   ${plantObj.description}
                 </p>
               </div>
             </div>
             <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
               <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-ruler text-xs"></i>
                   <span class="text-xs">Semimajor Axis</span>
                 </p>
                 <p
                   id="planet-distance"
                   class="text-sm md:text-lg font-semibold"
                 >
                   ${(plantObj.semimajorAxis/1e6).toFixed(1)}M km
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-circle"></i>
                   Mean Radius
                 </p>
                 <p id="planet-radius" class="text-lg font-semibold">
                  ${plantObj.meanRadius} km
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-weight"></i>
                   Mass
                 </p>
                 <p id="planet-mass" class="text-lg font-semibold">
                  ${plantObj.mass.massValue} × 10<sup>${plantObj.mass.massExponent}</sup> kg
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-compress"></i>
                   Density
                 </p>
                 <p id="planet-density" class="text-lg font-semibold">
                   ${(plantObj.density).toFixed(2)} g/cm³
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-sync-alt"></i>
                   Orbital Period
                 </p>
                 <p id="planet-orbital-period" class="text-lg font-semibold">
                  ${(plantObj.sideralOrbit).toFixed(2)} days
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-redo"></i>
                   Rotation Period
                 </p>
                 <p id="planet-rotation" class="text-lg font-semibold">
                   ${plantObj.sideralRotation} hours
                 </p>
               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-moon"></i>
                   Moons
                 </p>
          <p id="planet-moons" class="text-lg font-semibold">${plantObj.moons ? plantObj.moons.length : 0}</p>

               </div>
               <div class="bg-slate-900/50 rounded-lg p-4">
                 <p
                   class="text-xs text-slate-400 mb-1 flex items-center gap-1"
                 >
                   <i class="fas fa-arrows-alt-v"></i>
                   Gravity
                 </p>
                 <p id="planet-gravity" class="text-lg font-semibold">
                   ${plantObj.gravity} m/s²
                 </p>
               </div>
             </div>
           </div>
           <div class="space-y-6">
             <div
               class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
             >
               <h4 class="font-semibold mb-4 flex items-center">
                 <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
                 Discovery Info
               </h4>
               <div class="space-y-3 text-sm">
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Discovered By</span>
                   <span
                     id="planet-discoverer"
                     class="font-semibold text-right"
                     >Known since antiquity</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Discovery Date</span>
                   <span id="planet-discovery-date" class="font-semibold"
                     >Ancient</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Body Type</span>
                   <span id="planet-body-type" class="font-semibold"
                     >Planet</span
                   >
                 </div>
                 <div class="flex justify-between items-center py-2">
                   <span class="text-slate-400">Volume</span>
                   <span id="planet-volume" class="font-semibold">N/A</span>
                 </div>
               </div>
             </div>
             <div
               class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
             >
               <h4 class="font-semibold mb-4 flex items-center">
                 <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                 Quick Facts
               </h4>
               <ul id="planet-facts" class="space-y-3 text-sm">
                 <li class="flex items-start">
                   <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                   <span class="text-slate-300"
                     >Only known planet with liquid water</span
                   >
                 </li>
                 <li class="flex items-start">
                   <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                   <span class="text-slate-300"
                     >Atmosphere contains 78% nitrogen</span
                   >
                 </li>
                 <li class="flex items-start">
                   <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                   <span class="text-slate-300"
                     >Magnetic field protects from solar wind</span
                   >
                 </li>
                 <li class="flex items-start">
                   <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                   <span class="text-slate-300"
                     >Formed 4.54 billion years ago</span
                   >
                 </li>
               </ul>
             </div>
             <div
               class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
             >
               <h4 class="font-semibold mb-4 flex items-center">
                 <i class="fas fa-satellite text-blue-400 mr-2"></i>
                 Orbital Characteristics
               </h4>
               <div class="space-y-3 text-sm">
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Perihelion</span>
                   <span id="planet-perihelion" class="font-semibold"
                     >147.1M km</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Aphelion</span>
                   <span id="planet-aphelion" class="font-semibold"
                     >152.1M km</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Eccentricity</span>
                   <span id="planet-eccentricity" class="font-semibold"
                     >0.0167</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Inclination</span>
                   <span id="planet-inclination" class="font-semibold"
                     >0.00°</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Axial Tilt</span>
                   <span id="planet-axial-tilt" class="font-semibold"
                     >23.44°</span
                   >
                 </div>
                 <div
                   class="flex justify-between items-center py-2 border-b border-slate-700"
                 >
                   <span class="text-slate-400">Avg Temperature</span>
                   <span id="planet-temp" class="font-semibold">15°C</span>
                 </div>
                 <div class="flex justify-between items-center py-2">
                   <span class="text-slate-400">Escape Velocity</span>
                   <span id="planet-escape" class="font-semibold"
                     >11.2 km/s</span
                   >
                 </div>
               </div>
             </div>
             <button
               class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
             >
               <i class="fas fa-book mr-2"></i>Learn More
             </button>
           </div>
       `
    });
  });
}
