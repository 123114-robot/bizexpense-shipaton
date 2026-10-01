import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

export function AuthScreen() {
  const { login, register, loading, error } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => creating ? register(name, email, password) : login(email, password);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>BIZEXPENSE MOBILE</Text>
          <Text style={styles.title}>{creating ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.copy}>Sign in to securely access your business expenses.</Text>
          {creating && <TextInput autoCapitalize="words" placeholder="Name" value={name} onChangeText={setName} style={styles.input} />}
          <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput autoCapitalize="none" autoComplete={creating ? 'new-password' : 'current-password'} placeholder={creating ? 'Password (12+ characters)' : 'Password'} secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable disabled={loading || !email || !password || (creating && (!name || password.length < 12))} onPress={() => void submit()} style={({ pressed }) => [styles.primary, (pressed || loading) && styles.dim]}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryText}>{creating ? 'Create account' : 'Sign in'}</Text>}
          </Pressable>
          <Pressable onPress={() => setCreating((value) => !value)} style={styles.switchButton}>
            <Text style={styles.switchText}>{creating ? 'Already have an account? Sign in' : 'New to BizExpense? Create account'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F5F7FB' }, center: { flex: 1, justifyContent: 'center', padding: 24 }, card: { backgroundColor: '#FFF', borderRadius: 22, padding: 24, gap: 14 }, eyebrow: { color: '#1B6EF3', fontWeight: '900', letterSpacing: 2 }, title: { color: '#10213B', fontSize: 30, fontWeight: '900' }, copy: { color: '#667085', lineHeight: 21, marginBottom: 6 }, input: { borderWidth: 1, borderColor: '#D8DEE9', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#FFF' }, error: { color: '#B42318', lineHeight: 20 }, primary: { backgroundColor: '#1B6EF3', borderRadius: 12, minHeight: 50, justifyContent: 'center', alignItems: 'center' }, primaryText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, dim: { opacity: 0.6 }, switchButton: { padding: 8, alignItems: 'center' }, switchText: { color: '#1B6EF3', fontWeight: '700' } });
