import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import LoadingScreen from '../components/LoadingScreen';
import { User, Mail, Lock, Phone, Bike, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react-native';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    bikeModel: 'KTM 250 Duke',
    regNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      Alert.alert('Required Fields', 'Please fill in Name, Email and Password at minimum.');
      return;
    }

    setLoading(true);
    try {
      const registerUrl = `${process.env.EXPO_PUBLIC_API_URL}/register`;
      console.log(`[CLIENT-AUTH] 📡 Attempting Registration. URL: ${registerUrl}`);
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(`[CLIENT-AUTH] 🚥 Server response status: ${response.status}`);

      if (response.ok) {
        console.log(`[CLIENT-AUTH] ✅ Registration successful for email: ${email}`);
        Alert.alert('Success', 'Welcome to the KTM family! Please login.', [
          { text: 'Login Now', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        console.warn(`[CLIENT-AUTH] ⚠️ Registration failed:`, data.error || 'Unknown error');
        Alert.alert('Registration Failed', data.error || 'Check your details and try again');
      }
    } catch (error) {
      console.error(`[CLIENT-AUTH] ❌ Connection error:`, error.message);
      Alert.alert('Error', 'Could not connect to the racing server.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <LoadingScreen message="JOINING THE FAMILY..." />;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
         <ArrowLeft size={24} color={Colors.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
           <Text style={styles.title}>SIGN UP</Text>
           <Text style={styles.subtitle}>Create your rider profile</Text>
        </View>

        <View style={styles.form}>
          <InputGroup icon={User} placeholder="Full Name" value={formData.name} onChangeText={(v) => updateField('name', v)} />
          <InputGroup icon={Mail} placeholder="Email Address" value={formData.email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" />
          <InputGroup icon={Lock} placeholder="Password" value={formData.password} onChangeText={(v) => updateField('password', v)} secureTextEntry />
          <InputGroup icon={Phone} placeholder="Mobile Number" value={formData.mobile} onChangeText={(v) => updateField('mobile', v)} keyboardType="phone-pad" />
          <InputGroup icon={Bike} placeholder="Bike Model (e.g. Duke 250)" value={formData.bikeModel} onChangeText={(v) => updateField('bikeModel', v)} />
          <InputGroup icon={CreditCard} placeholder="Registration Number" value={formData.regNumber} onChangeText={(v) => updateField('regNumber', v)} autoCapitalize="characters" />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
             <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
             <ChevronRight size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputGroup = ({ icon: Icon, ...props }) => (
  <View style={styles.inputGroup}>
    <Icon size={20} color={Colors.textSecondary} style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholderTextColor={Colors.textSecondary}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  form: {
    paddingBottom: 40,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: Spacing.sm,
  }
});

export default RegisterScreen;
