
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    padding: width * 0.05,
    marginBottom: 20,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: width * 0.035,
  },
  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: width * 0.05,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryValue: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: width * 0.03,
    textAlign: 'center',
  },
  sessionsList: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 100,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: width * 0.032,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: width * 0.03,
    fontWeight: '500',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: width * 0.028,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: width * 0.032,
    fontWeight: '600',
  },
  noSessionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    paddingVertical: 60,
  },
  noSessionsText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  noSessionsSubtext: {
    fontSize: width * 0.035,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});
