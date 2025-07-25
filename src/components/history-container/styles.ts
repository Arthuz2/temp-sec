import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: width * 0.05,
    marginVertical: 20,
    marginBottom: 40,
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
