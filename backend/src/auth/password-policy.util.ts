
const compromised = [
  '12345678',
  'password',
  'qwerty123',
  'colombia2024',
  'elecciones',
];

export function validatePasswordPolicy(
  password: string,
  username: string,
  document?: string,
): string | null {
  if (password.length < 8 || password.length > 64) {
    return 'La contraseña debe tener entre 8 y 64 caracteres.';
  }
  const normalized = password.toLowerCase();
  if (compromised.includes(normalized)) {
    return 'La contraseña está en una lista de contraseñas inseguras.';
  }
  if (normalized.includes(username.toLowerCase())) {
    return 'La contraseña no puede contener el usuario.';
  }
  if (document && normalized.includes(document.toLowerCase())) {
    return 'La contraseña no puede contener la cédula asociada.';
  }
  return null;
}
