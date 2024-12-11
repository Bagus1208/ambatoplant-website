// URL API
const apiURL = "https://backend-122135389835.asia-southeast2.run.app/api/plant"; 

// Fungsi untuk mengambil data dari API
async function fetchData() {
  try {
    const response = await fetch(apiURL); // Mengirim permintaan ke API
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json(); // Mengubah respons menjadi JSON
    if (result.success) {
      const data = result.data;
      displayData(data); // Panggil fungsi untuk menampilkan data
    } else {
      console.error("API error:", result.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Fungsi untuk menampilkan data ke dalam elemen HTML
function displayData(data) {
  const container = document.getElementById("plant-list"); 
  container.innerHTML = ""; 

  data.forEach((item) => {
    const plantLink = document.createElement("a");
    plantLink.href = "#";
    plantLink.className = "relative block rounded-tr-3xl border border-gray-100";
    plantLink.setAttribute("data-id", item.id); 
    plantLink.addEventListener("click", (event) => {
      event.preventDefault();
      fetchById(item.id);
    });

    // Gambar tanaman
    const img = document.createElement("img");
    img.src = "assets/images/plants/" + item.name + ".jpg";
    img.alt = item.name;
    img.className = "h-80 w-full rounded-tr-3xl object-cover";
    img.onerror = () => {
      console.error(`Gambar gagal dimuat: ${item.image_url}`);
    };
    img.onload = () => {
        console.log(`Gambar berhasil dimuat: ${item.image_url}`);
    };

    plantLink.appendChild(img);

    // Detail tanaman
    const detailDiv = document.createElement("div");
    detailDiv.className = "p-4 text-center";

    // Nama tanaman
    const name = document.createElement("strong");
    name.className = "text-xl font-medium text-gray-900";
    name.textContent = item.name;
    detailDiv.appendChild(name);

    // Deskripsi tanaman
    const description = document.createElement("p");
    description.className = "mt-2 text-pretty text-gray-700";
    description.textContent = item.description; // Tampilkan deskripsi pertama dari benefits
    detailDiv.appendChild(description);

    // Tombol rincian
    const detailButton = document.createElement("span");
    detailButton.className =
      "mt-4 block rounded-md border border-green-900 bg-green-700 px-5 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-green-700";
    detailButton.textContent = "RINCIAN";
    detailButton.setAttribute("data-id", item.id); 
    detailButton.addEventListener("click", (event) => {
      event.preventDefault();
      fetchById(item.id);
    });
    detailDiv.appendChild(detailButton);

    // Tambahkan detail ke dalam link
    plantLink.appendChild(detailDiv);

    // Tambahkan link ke dalam kontainer
    container.appendChild(plantLink);
  });
}

// Fungsi untuk mengambil data berdasarkan ID
async function fetchById(id) {
  try {
    const response = await fetch(`${apiURL}/${id}`); // Fetch data by ID
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json(); // Mengubah respons menjadi JSON
    if (result.success) {
      displayPopup(result.data); // Panggil fungsi untuk menampilkan popup dengan data
    } else {
      console.error("API error:", result.message);
    }
  } catch (error) {
    console.error("Fetch by ID error:", error);
  }
}

// Fungsi untuk menampilkan data di popup
function displayPopup(data) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupBenefits = document.getElementById("popup-benefits");
  const popupCareTips = document.getElementById("popup-care-tips");
  const popupImage = document.getElementById("popup-image");
  const popupContent = document.getElementById("popup-content");

  // Isi data popup
  popupTitle.textContent = data.name;
  popupBenefits.innerHTML = data.benefits
    .map((benefit) => `<li class="m-1.5">${benefit}</li>`)
    .join("");
  popupCareTips.innerHTML = data.care_tips
    .map((tip) => `<li class="m-1.5">${tip}</li>`)
    .join("");
  popupImage.src = "assets/images/plants/" + data.name + ".jpg";
  popupImage.alt = data.name;

  popupContent.scrollTop = 0;

  // Tampilkan popup
  popup.classList.remove("hidden");
}

// Fungsi untuk menutup popup
document.addEventListener("DOMContentLoaded", () => {
  const closeButton = document.getElementById("close-popup");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      document.getElementById("popup").classList.add("hidden");
    });
  } else {
    console.error("Element with ID 'close-popup' not found.");
  }
});

// Panggil fungsi untuk memuat data saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchData);