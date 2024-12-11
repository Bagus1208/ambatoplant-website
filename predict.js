let dropzone = document.getElementById('dropzone');

// Event untuk drag over
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('border-indigo-600');
});

// Event untuk drag leave
dropzone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropzone.classList.remove('border-indigo-600');
});

// Event untuk drop
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('border-indigo-600');

  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    let file = e.dataTransfer.files[0];
    if (file && isValidImage(file)) {
      displayPreview(file);
    } else {
      alert('Please upload a valid image file (PNG, JPG).');
    }
    e.dataTransfer.clearData();
  }
});

// Event untuk input file
let input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  let file = e.target.files[0];
  if (file && isValidImage(file)) {
    displayPreview(file);
  } else {
    alert('Please upload a valid image file (PNG, JPG).');
  }
});

// Fungsi untuk menampilkan preview file
function displayPreview(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    let uploadbox = document.getElementById('uploadbox');
    uploadbox.classList.add('hidden')
    let preview = document.getElementById('preview');
    preview.src = reader.result;
    preview.classList.remove('hidden');
  };

  reader.onerror = () => {
    console.error('Error reading file');
  };
}

// Fungsi untuk validasi file gambar
function isValidImage(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  return validTypes.includes(file.type);
}





// Pilih tombol prediksi
let predictButton = document.getElementById('predict-buttton');

// Tambahkan event listener untuk tombol prediksi
predictButton.addEventListener('click', async () => {
  // Ambil file dari input
  let file = input.files[0];

  if (!file) {
    alert('Silakan upload file gambar terlebih dahulu!');
    return;
  }

  if (!isValidImage(file)) {
    alert('File harus berupa gambar (PNG, JPG).');
    return;
  }

  // Buat FormData untuk mengirim file ke endpoint
  let formData = new FormData();
  formData.append('file', file);

  try {
    // Kirim file ke endpoint
    const response = await fetch('https://ml-api-122135389835.asia-southeast2.run.app:8080/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Ambil hasil prediksi
    const result = await response.json();

    // Tampilkan hasil prediksi di halaman
    displayPredictionResult(result);
  } catch (error) {
    console.error('Error during prediction:', error);
    alert('Terjadi kesalahan saat memproses prediksi. Silakan coba lagi.');
  }
});

// Fungsi untuk menampilkan hasil prediksi
function displayPredictionResult(result) {
  const predictionResult = document.getElementById('prediction-result');
  const predictedSpecies = document.getElementById('predicted-species');
  const img = document.getElementById("plant-image");
  img.src = "assets/images/plants/" + result.predicted_species + ".jpg";
  const confidence = document.getElementById('confidence');

  // Isi data hasil prediksi
  predictedSpecies.textContent = `Jenis Tanaman: ${result.predicted_species}`;
  confidence.textContent = `Tingkat Kecocokan: ${(result.confidence * 100).toFixed(2)}%`;

  // Tampilkan elemen hasil prediksi
  predictionResult.classList.remove('hidden');
}