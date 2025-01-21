import { StyleSheet } from 'react-native';

const baseText = { 
  fontWeight: 'bold', 
  textAlign: 'center', 
  color: 'white',
  alignItems: 'center', 
  justifyContent: 'center'
};

const globalStyles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
  },
  top: { 
    height: 100, 
    backgroundColor: '#007bff', 
    display: 'flex',
    gap: 20,
    ...baseText,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    ...baseText,
    fontSize: 32,
  },
  paragraph: {
    ...baseText,
    fontSize: 16,
  },
  form:{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    width: '90%',
    margin: "auto",
    position: 'relative', // Added to position the eye icon within the input container
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    paddingRight: 40, // Added padding to accommodate the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Centers the icon vertically within the input
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    width: '90%',
    margin: "auto",
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    ...baseText,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    ...baseText,
  },
  loginLinkContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
});

export default globalStyles;
