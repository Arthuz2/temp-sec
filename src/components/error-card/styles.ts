import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    backgroundColor: "#FFF5F5",
    marginHorizontal: width * 0.05,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 2,
  },
  message: {
    fontSize: width * 0.032,
    color: "#666",
    marginBottom: 4,
  },
  retryInfo: {
    fontSize: width * 0.028,
    color: "#999",
    fontStyle: "italic",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  retryText: {
    fontSize: width * 0.032,
    color: "#FF6B6B",
    marginLeft: 4,
    fontWeight: "500",
  },
})
