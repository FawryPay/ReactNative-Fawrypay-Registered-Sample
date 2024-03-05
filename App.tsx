import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Fawry from '@fawry_pay/rn-fawry-pay-registered-sdk';
import uuid from 'react-native-uuid';

const cartItems: Fawry.BillItems[] = [
  {
    itemId: 'item1',
    description: 'Item 1 Description',
    quantity: '1',
    price: '300',
    originalPrice: '500',
    tax: 8.5
  },
  {
    itemId: 'item2',
    description: 'Item 2 Description',
    quantity: '1',
    price: '200',
    originalPrice: '600',
    tax: 7.5
  },
  {
    itemId: 'item3',
    description: 'Item 3 Description',
    quantity: '1',
    price: '500',
    originalPrice: '700',
    tax: 10
  },
];

const merchant: Fawry.MerchantInfo = {
  merchantCode:"4000000996",
  subMerchantCode:"4000000998",
  merchantSecretCode:"69826c87-963d-47b7-8beb-869f7461fd93",
  merchantRefNum: uuid.v4().toString(),
};

const customer: Fawry.CustomerInfo = {
  customerName: 'Ahmed Kamal',
  customerMobile: '01100796994',
  customerEmail: 'ahmed.kamal@example.com',
  customerProfileId: '71917',
  customerCif: '',
  customerToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4MDQ0NDk4NzQyMjQyNDYyNzUxIiwicmxtIjoiQkVDIiwiZnBhIjoiNjMyNTg3NDUyMzAxIiwiYmVpIjoyMDQsImlzcyI6ImZhd3J5LmNvbSIsImV4cCI6MTcwOTM0MjQ2OCwiaWF0IjoxNzA5MzM1MjY4LCJqdGkiOiI1ZTk1OWRmMS1iNWNiLTQ2NjYtYTc4Yi1kMTRiMmU3ZTA3N2IifQ.B-sxNIQXfYIlPHDYLDpWKLTWpcB3HJUfrHjsbgBYD1Y",
};

const shippingAddress: Fawry.Address = {
  buildingNumber: '123',
  floorNumber: "5",
  apartmentNumber: '7',
  receiverName: 'Receiver Name',
  receiverMobile: '+9876543210',
};

const fawryConfig: Fawry.FawryLaunchModel = {
  addressHierarchy: Fawry.AddressHierarchy.MATRIX,
  allow3DPayment: true,
  apiPath: 'fawrypay-api/api/',
  baseUrl: 'https://omega.consumer.fawry.io/',
  beid: '',
  branchCode: '67bf06ed204f47639ac151b2490c6948',
  branchName: 'Main Branch',
  customerInfo: customer,
  items: cartItems,
  lang: Fawry.FawryLanguages.ENGLISH,
  merchantInfo: merchant,
  scheduledTime: new Date().getTime().toString(),
  serviceTypeCode: 'PICKUP',
  shippingAddress: shippingAddress ,
  showLoyaltyContainer: true,
  showTipsView: false,
  showVoucherContainer: true,
  skipReceipt: false,
  tableId: 1,
};

const eventListeners = [
  {
    eventName: Fawry.FawryCallbacks.FAWRY_EVENT_PAYMENT_COMPLETED,
    listener: (data: any) =>
      console.log(Fawry.FawryCallbacks.FAWRY_EVENT_PAYMENT_COMPLETED, data),
  },
  {
    eventName: Fawry.FawryCallbacks.FAWRY_EVENT_ON_SUCCESS,
    listener: (data: any) =>
      console.log(Fawry.FawryCallbacks.FAWRY_EVENT_ON_SUCCESS, data),
  },
  {
    eventName: Fawry.FawryCallbacks.FAWRY_EVENT_ON_FAIL,
    listener: (error: any) =>
      console.log(Fawry.FawryCallbacks.FAWRY_EVENT_ON_FAIL, error),
      
  },
  {
    eventName: Fawry.FawryCallbacks.FAWRY_EVENT_CARD_MANAGER_FAIL,
    listener: (error: any) =>
      console.log(Fawry.FawryCallbacks.FAWRY_EVENT_CARD_MANAGER_FAIL, error),
  },
  {
    eventName: Fawry.FawryCallbacks.FAWRY_EVENT_ADDRESS_MANAGER_FAIL,
    listener: (error: any) =>
      console.log(Fawry.FawryCallbacks.FAWRY_EVENT_ADDRESS_MANAGER_FAIL, error),
  },
];

const attachEventListeners = () =>
  eventListeners.forEach(({ eventName, listener }) =>
    Fawry.FawryCallbacks.FawryEmitter.addListener(eventName, listener)
  );

const detachEventListeners = () =>
  eventListeners.forEach(({ eventName }) =>
    Fawry.FawryCallbacks.FawryEmitter.removeAllListeners(eventName)
  );

const App = () => {
  useEffect(() => {
    attachEventListeners();

    return detachEventListeners;
  }, []);

  const handlePayments = () => {
    const updatedMerchant = { ...merchant, merchantRefNum: uuid.v4().toString() };
    Fawry.startPayment(
      fawryConfig.addressHierarchy,
      fawryConfig.allow3DPayment,
      fawryConfig.apiPath,
      fawryConfig.baseUrl,
      fawryConfig.customerInfo,
      fawryConfig.items,
      fawryConfig.lang,
      updatedMerchant,
      fawryConfig.showLoyaltyContainer,
      fawryConfig.showTipsView,
      fawryConfig.showVoucherContainer,
      fawryConfig.skipReceipt,
      fawryConfig.beid,
      fawryConfig.branchCode,
      fawryConfig.branchName,
      fawryConfig.scheduledTime,
      fawryConfig.serviceTypeCode,
      fawryConfig.tableId,
      fawryConfig.shippingAddress,
    );
  };

  const handleCardsManager = () =>
    Fawry.openCardsManager(
      fawryConfig.baseUrl,
      fawryConfig.lang,
      fawryConfig.merchantInfo,
      fawryConfig.customerInfo,
    );

  const handleAddressManager = () =>
    Fawry.openAddressManager(
      fawryConfig.baseUrl,
      fawryConfig.lang,
      fawryConfig.merchantInfo,
      fawryConfig.customerInfo,
      fawryConfig.beid,
      fawryConfig.addressHierarchy
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePayments}>
        <Text style={styles.buttonText}>Start Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCardsManager}>
        <Text style={styles.buttonText}>Manage Cards</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddressManager}>
        <Text style={styles.buttonText}>Manage Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#016891',
    padding: 15,
    margin: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
