import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  infoSection: {
    marginHorizontal: width * 0.05,
    marginVertical: 15,
  },
  infoCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: width * 0.04,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: width * 0.045,
    fontWeight: "700",
    textAlign: "center",
  },
});