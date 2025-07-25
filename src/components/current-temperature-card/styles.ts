import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    marginHorizontal: width * 0.05,
    marginVertical: 20,
    borderRadius: 20,
    padding: width * 0.05,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: width > 400 ? "row" : "column",
    alignItems: "center",
    justifyContent: width > 400 ? "space-between" : "center",
  },
  upSection: {
    alignItems: "center",
    marginBottom: width > 400 ? 0 : 15,
  },
  bottomSection: {
    flex: width > 400 ? 1 : 0,
    marginLeft: width > 400 ? 20 : 0,
    alignItems: width > 400 ? "flex-start" : "center",
  },
  temperatureValue: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "white",
    textAlign: width > 400 ? "left" : "center",
  },
  time: {
    fontSize: width * 0.035,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    textAlign: width > 400 ? "left" : "center",
  },
})

export const iconSize = Math.max(50, width * 0.15)
