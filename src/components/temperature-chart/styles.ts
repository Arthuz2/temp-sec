
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const maxBarHeight = 120;

export default StyleSheet.create({
  container: {
    marginHorizontal: width * 0.05,
    marginBottom: 20,
    borderRadius: 15,
    padding: width * 0.05,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: width * 0.032,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: width * 0.03,
    marginBottom: 2,
  },
  statValue: {
    fontSize: width * 0.038,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: maxBarHeight + 60,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: maxBarHeight + 20,
    marginRight: 10,
    paddingTop: 20,
  },
  yAxisLabel: {
    fontSize: width * 0.028,
    textAlign: 'right',
  },
  chartContainer: {
    position: 'relative',
    flex: 1,
    height: maxBarHeight + 60,
  },
  svgChart: {
    position: 'absolute',
    top: 34,
    left: 0,
  },
  labelsContainer: {
    position: 'relative',
    height: maxBarHeight + 60,
  },
  chartPoint: {
    position: 'absolute',
    alignItems: 'center',
    width: 40,
    top: 0,
  },
  chartValue: {
    fontSize: width * 0.028,
    fontWeight: '500',
    textAlign: 'center',
  },

  chartDate: {
    fontSize: width * 0.024,
    textAlign: 'center',
    lineHeight: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  errorBannerText: {
    fontSize: width * 0.032,
    marginLeft: 6,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: width * 0.035,
    marginTop: 10,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 6,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  legendItem: {
    alignItems: "center",
    flexDirection: 'row',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: width * 0.03,
  },
});
