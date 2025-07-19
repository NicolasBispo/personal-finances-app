import { Colors } from '@/constants/Colors'
import { useAuth } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { z } from 'zod'

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const colors = Colors.light
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      // Redireciona para a tela principal após login bem-sucedido
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        'Email ou senha incorretos. Tente novamente.',
        [{ text: 'OK' }]
      )
    }
  }


  const handleSignup = () => {
    // Navega para a tela de cadastro (você pode criar esta tela depois)
    // router.push('/(auth)/signup')
    Alert.alert('Em desenvolvimento', 'Tela de cadastro será implementada em breve!')
  }


  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Bem-vindo de volta!
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Faça login para acessar sua conta
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#F5F5F5',
                        color: colors.text,
                        borderColor: errors.email ? '#FF4444' : 'transparent'
                      }
                    ]}
                    placeholder="Digite seu email"
                    placeholderTextColor={colors.icon}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                Senha
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        {
                          backgroundColor: '#F5F5F5',
                          color: colors.text,
                          borderColor: errors.password ? '#FF4444' : 'transparent'
                        }
                      ]}
                      placeholder="Digite sua senha"
                      placeholderTextColor={colors.icon}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={[styles.eyeText, { color: colors.icon }]}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: colors.tint,
                  opacity: isSubmitting || isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.icon }]}>
                Não tem uma conta?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={[styles.signupLink, { color: colors.tint }]}>
                  Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22
  },
  form: {
    gap: 20
  },
  inputContainer: {
    gap: 8
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1
  },
  passwordContainer: {
    position: 'relative'
  },
  passwordInput: {
    paddingRight: 50
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eyeText: {
    fontSize: 16
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 4
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  signupText: {
    fontSize: 14
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600'
  }
})
