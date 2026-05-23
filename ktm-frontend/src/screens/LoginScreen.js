import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Mail, Lock, ChevronRight } from 'lucide-react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    setLoading(true);
    const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/login`;
    console.log(`[CLIENT-AUTH] 📡 Sending POST to /login for ${email}`);

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(`[CLIENT-AUTH] 🚥 Server response status: ${response.status}`);

      if (response.ok) {
        console.log(`[CLIENT-AUTH] ✅ Login success:`, data);
        login(data);
      } else {
        console.warn(`[CLIENT-AUTH] ⚠️ Login failed:`, data.error || 'Unknown error');
        Alert.alert('Login Failed', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(`[CLIENT-AUTH] ❌ Connection error:`, error.message);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="AUTHENTICATING..." />;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
         <Image source={require('../assets/ktm_bike.png')} style={styles.logo} resizeMode="contain" />
         <Text style={styles.title}>READY TO RACE</Text>
         <Text style={styles.subtitle}>Log in to your rider profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
           <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
           <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
           />
        </View>

        <View style={styles.inputGroup}>
           <Lock size={20} color={Colors.textSecondary} style={styles.inputIcon} />
           <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
           />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
           <Text style={styles.loginButtonText}>LOGIN</Text>
           <ChevronRight size={24} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
           <Text style={styles.registerText}>
             New rider? <Text style={styles.registerHighlight}>Create account</Text>
           </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: Spacing.md,
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
    marginTop: Spacing.xl,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 60,
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
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginButtonText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: Spacing.sm,
  },
  registerLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  registerHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
