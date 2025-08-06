
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: width * 0.04,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: width * 0.035,
    marginTop: 4,
    textAlign: 'center',
  },
  alertItem: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertType: {
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  alertTemperature: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: 2,
  },
  alertTime: {
    fontSize: width * 0.032,
  },
  alertMessage: {
    fontSize: width * 0.035,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: width * 0.032,
    marginTop: 4,
    textAlign: 'center',
  },
});
