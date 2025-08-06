
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: width * 0.05,
    paddingVertical: 20,
    paddingHorizontal: width * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: width * 0.035,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  inputPrefix: {
    fontSize: width * 0.035,
    marginRight: 8,
  },
  inputValue: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  aboutInfo: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  appName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: width * 0.035,
    marginBottom: 10,
  },
  appDescription: {
    fontSize: width * 0.035,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    padding: 8,
  },
  inputField: {
    fontSize: width * 0.04,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
    marginLeft: 8,
  },
});
