import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    minHeight: 60,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  date: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#333",
  },
  time: {
    fontSize: width * 0.03,
    color: "#666",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 60,
  },
  temperature: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})

export const iconSize = Math.max(20, width * 0.06)
