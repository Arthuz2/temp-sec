
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  settingsSection: {
    paddingHorizontal: width * 0.05,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: width * 0.04,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  clearButtonText: {
    fontSize: width * 0.035,
    marginLeft: 4,
    fontWeight: '500',
  },
  historyList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 12,
    marginVertical: 10,
  },
  emptyStateText: {
    fontSize: width * 0.04,
    marginTop: 12,
    textAlign: 'center',
  },
  notificationItem: {
    borderRadius: 12,
    marginVertical: 5,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
    marginTop: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  notificationContent: {
    flex: 1,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationType: {
    fontSize: width * 0.035,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationTime: {
    fontSize: width * 0.032,
  },
  notificationTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
  },
  temperatureBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  temperatureValue: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  backgroundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
  backgroundInfoText: {
    fontSize: width * 0.035,
    marginLeft: 6,
  },
});
