import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 5,
  },
})
