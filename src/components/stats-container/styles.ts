import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
    flexWrap: width < 350 ? "wrap" : "nowrap",
  },
})
