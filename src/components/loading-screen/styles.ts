import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
  },
  spinner: {
    marginVertical: 20,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
})
