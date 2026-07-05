<script setup>
navigator.geolocation.getCurrentPosition(
  position => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  error => {
    console.error('Error getting location:', error);
  }
);

const contactInfo = {
  address: '123 Main Street, Dhaka, Bangladesh',
  phone: '+880 1234 567890',
  email: 'support@shopease.com',
  location:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.461828839915!2d90.41123117421735!3d23.80316008681764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c77c5c95c2d3%3A0x3e2e78dc20b553c6!2sMirpur%201%20Bus%20Stand!5e0!3m2!1sen!2sbd!4v1694047639334!5m2!1sen!2sbd',
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-3xl font-bold mb-6 text-center">Contact Us</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Info -->
      <div class="space-y- text-sm">
        <div>
          <h3 class="text-xl font-semibold">Address</h3>
          <p class="text-gray-600">{{ contactInfo.address }}</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold">Phone</h3>
          <p class="text-gray-600">{{ contactInfo.phone }}</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold">Email</h3>
          <p class="text-gray-600">{{ contactInfo.email }}</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold mb-4 mt-4">Map</h3>
          <iframe
            :src="contactInfo.location"
            width="100%"
            height="250"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="rounded-lg shadow"
          ></iframe>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Send Us a Message</h3>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              class="w-full px-4 py-2 border rounded"
              placeholder="Your name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              class="w-full px-4 py-2 border rounded"
              placeholder="Your email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Message</label
            >
            <textarea
              class="w-full px-4 py-2 border rounded"
              rows="4"
              placeholder="Your message"
            ></textarea>
          </div>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
