import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: width * 0.05,
    marginVertical: 20,
    borderRadius: 15,
    padding: width * 0.05,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  scrollContent: {
    alignItems: "flex-end",
    minHeight: Math.max(120, width * 0.3),
    paddingHorizontal: 10,
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    minWidth: width * 0.8,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
    maxWidth: width * 0.1,
    marginHorizontal: width * 0.02,
  },
  chartValue: {
    fontSize: width * 0.025,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  bar: {
    width: Math.max(15, width * 0.04),
    borderRadius: 10,
    marginBottom: 5,
  },
  chartDate: {
    fontSize: width * 0.022,
    color: "#666",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorBannerText: {
    fontSize: width * 0.03,
    color: "#FF6B6B",
    marginLeft: 5,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: width * 0.035,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
})

export const maxBarHeight = width * 0.15
