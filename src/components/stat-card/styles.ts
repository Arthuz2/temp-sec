import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flex: width < 350 ? 0 : 1,
    width: width < 350 ? width * 0.28 : "auto",
    marginHorizontal: width < 350 ? width * 0.01 : 5,
    marginVertical: width < 350 ? 5 : 0,
    padding: width * 0.04,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 80,
  },
  value: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  label: {
    fontSize: width * 0.03,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textAlign: "center",
  },
})

export const iconSize = Math.max(20, width * 0.06);
