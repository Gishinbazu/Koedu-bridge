import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ConsentCheckbox({ onConsentChange }) {
  const [checked, setChecked] = useState(false);

  const toggle = () => {
    setChecked(!checked);
    onConsentChange(!checked);
  };

  return (
    <TouchableOpacity onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        height: 24, width: 24, borderWidth: 1, borderColor: '#000', marginRight: 10,
        backgroundColor: checked ? '#007bff' : '#fff'
      }} />
      <Text>J’accepte les conditions d’utilisation et la politique de confidentialité</Text>
    </TouchableOpacity>
  );
}
