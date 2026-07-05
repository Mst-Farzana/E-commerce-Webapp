<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { API_BASE } from '../../utils/api';

const props = defineProps({ product: Object });
const emit = defineEmits(['close']);

const deliveryCharges = {
  'Inside Dhaka': 100,
  'Outside Dhaka': 150,
};

const form = ref({
  customerName: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: '',
  otp: '',

  bankAccountNumber: '',
  bankAccountName: '',
  bankBranchName: '',
  bankAmount: '',

  visaCardNo: '',
  visaValidDate: '',
  visaSpecialNo: '',
  visaPinNo: '',
  visaAmount: '',

  mobileAccountNo: '',
  mobilePin: '',
  mobileAmount: '',

  quantity: 1,
  deliveryOption: '',
});

const qrCode = ref('');

watch(
  () => form.value.paymentMethod,
  newMethod => {
    switch (newMethod) {
      case 'Bank Transfer':
        qrCode.value = '/qrcodes/bank-transfer.png';
        break;
      case 'Visa Card':
        qrCode.value = '/qrcodes/visa-card.png';
        break;
      case 'Bkash':
        qrCode.value = '/qrcodes/bkash.png';
        break;
      case 'Nagad':
        qrCode.value = '/qrcodes/nagad.png';
        break;
      case 'Rocket':
        qrCode.value = '/qrcodes/rocket.png';
        break;
      default:
        qrCode.value = '';
    }
  }
);

const submitOrder = async () => {
  if (
    !form.value.customerName ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.address ||
    !form.value.paymentMethod ||
    (form.value.paymentMethod !== 'Cash on Delivery' && !form.value.otp) ||
    !form.value.quantity ||
    !form.value.deliveryOption
  ) {
    alert('Please fill all required fields including email, OTP, quantity and delivery option.');
    return;
  }

  const deliveryCharge = deliveryCharges[form.value.deliveryOption] || 0;
  const totalPrice = props.product.price * form.value.quantity + deliveryCharge;

  try {
    await axios.post(`${API_BASE}/api/orders`, {
      customerName: form.value.customerName,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      paymentMethod: form.value.paymentMethod,
      otp: form.value.otp,

      bankAccountNumber: form.value.bankAccountNumber,
      bankAccountName: form.value.bankAccountName,
      bankBranchName: form.value.bankBranchName,
      bankAmount: form.value.bankAmount,

      visaCardNo: form.value.visaCardNo,
      visaValidDate: form.value.visaValidDate,
      visaSpecialNo: form.value.visaSpecialNo,
      visaPinNo: form.value.visaPinNo,
      visaAmount: form.value.visaAmount,

      mobileAccountNo: form.value.mobileAccountNo,
      mobilePin: form.value.mobilePin,
      mobileAmount: form.value.mobileAmount,

      productId: props.product._id,
      productName: props.product.name,
      price: props.product.price,
      quantity: form.value.quantity,
      deliveryOption: form.value.deliveryOption,
      deliveryCharge,
      totalPrice,
    });

    alert('Order placed successfully!');
    emit('close');

    form.value = {
      customerName: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: '',
      otp: '',
      bankAccountNumber: '',
      bankAccountName: '',
      bankBranchName: '',
      bankAmount: '',
      visaCardNo: '',
      visaValidDate: '',
      visaSpecialNo: '',
      visaPinNo: '',
      visaAmount: '',
      mobileAccountNo: '',
      mobilePin: '',
      mobileAmount: '',
      quantity: 1,
      deliveryOption: '',
    };
    qrCode.value = '';
  } catch (error) {
    console.error('Order submission error:', error.response?.data || error.message || error);
    alert('Failed to place order. ' + (error.response?.data?.message || 'Please try again.'));
  }
};
</script>

<template>
  <div class="p-4 border mt-4 rounded shadow max-w-md mx-auto">
    <h2 class="text-xl mb-2 font-semibold">Confirm Your Order</h2>

    <input
      v-model="form.customerName"
      placeholder="Your Name"
      required
      class="mb-2 block w-full p-2 border rounded"
    />
    <input
      v-model="form.email"
      type="email"
      placeholder="Your Email"
      required
      class="mb-2 block w-full p-2 border rounded"
    />
    <input
      v-model="form.phone"
      placeholder="Phone"
      required
      class="mb-2 block w-full p-2 border rounded"
    />
    <input
      v-model="form.address"
      placeholder="Shipping Address"
      required
      class="mb-2 block w-full p-2 border rounded"
    />

    <select v-model="form.paymentMethod" required class="mb-2 block w-full p-2 border rounded">
      <option disabled value="">Select Payment Method</option>
      <option>Bank Transfer</option>
      <option>Visa Card</option>
      <option>Bkash</option>
      <option>Nagad</option>
      <option>Rocket</option>
      <option>Cash on Delivery</option>
    </select>

    <div v-if="form.paymentMethod === 'Bank Transfer'" class="mb-4 p-3 border rounded bg-gray-50">
      <input
        v-model="form.bankAccountNumber"
        placeholder="Bank Account Number"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.bankAccountName"
        placeholder="Account Name"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.bankBranchName"
        placeholder="Branch Name"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model.number="form.bankAmount"
        placeholder="Amount (৳)"
        type="number"
        min="0"
        class="mb-2 block w-full p-2 border rounded"
      />
    </div>

    <div v-else-if="form.paymentMethod === 'Visa Card'" class="mb-4 p-3 border rounded bg-gray-50">
      <input
        v-model="form.visaCardNo"
        placeholder="Card Number"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.visaValidDate"
        placeholder="Valid Date (MM/YY)"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.visaSpecialNo"
        placeholder="Special Number"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.visaPinNo"
        placeholder="PIN Number"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model.number="form.visaAmount"
        placeholder="Amount (৳)"
        type="number"
        min="0"
        class="mb-2 block w-full p-2 border rounded"
      />
    </div>

    <div
      v-else-if="['Bkash', 'Nagad', 'Rocket'].includes(form.paymentMethod)"
      class="mb-4 p-3 border rounded bg-gray-50"
    >
      <input
        v-model="form.mobileAccountNo"
        placeholder="Account Number"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model="form.mobilePin"
        placeholder="PIN"
        class="mb-2 block w-full p-2 border rounded"
      />
      <input
        v-model.number="form.mobileAmount"
        placeholder="Amount (৳)"
        type="number"
        min="0"
        class="mb-2 block w-full p-2 border rounded"
      />
    </div>

    <label class="block mb-2">
      Quantity:
      <input
        v-model.number="form.quantity"
        type="number"
        min="1"
        class="w-full border rounded px-2 py-1"
      />
    </label>

    <label class="block mb-4">
      Delivery Option:
      <select v-model="form.deliveryOption" class="w-full border rounded px-2 py-1" required>
        <option disabled value="">Select Delivery Option</option>
        <option>Inside Dhaka</option>
        <option>Outside Dhaka</option>
      </select>
    </label>

    <div v-if="qrCode" class="mb-4 text-center">
      <p class="mb-1 font-semibold">Scan QR code to pay:</p>
      <img :src="qrCode" alt="QR Code" class="mx-auto w-32 h-32" />
    </div>

    <div v-if="form.paymentMethod && form.paymentMethod !== 'Cash on Delivery'" class="mb-4">
      <input
        v-model="form.otp"
        type="text"
        placeholder="Enter OTP"
        required
        class="block w-full p-2 border rounded"
      />
    </div>

    <div
      v-if="form.quantity && form.deliveryOption"
      class="mb-4 p-3 border rounded bg-gray-100 text-gray-800"
    >
      <p>
        Item Price: ৳{{ props.product.price }} × {{ form.quantity }} = ৳{{
          props.product.price * form.quantity
        }}
      </p>
      <p>Delivery Charge: ৳{{ deliveryCharges[form.deliveryOption] || 0 }}</p>
      <p class="font-bold">
        Total Price: ৳{{
          props.product.price * form.quantity + (deliveryCharges[form.deliveryOption] || 0)
        }}
      </p>
    </div>

    <div class="flex items-center">
      <button @click.prevent="submitOrder" class="bg-blue-600 text-white px-4 py-2 rounded">
        Confirm
      </button>
      <button @click.prevent="emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">
        Cancel
      </button>
    </div>
  </div>
</template>
