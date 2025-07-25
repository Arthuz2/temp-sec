import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: width * 0.05,
  },
  toastContainer: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastMessage: {
    flex: 1,
    fontSize: width * 0.035,
    color: "white",
    fontWeight: "500",
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  successToast: {
    backgroundColor: "#4ECDC4",
  },
  errorToast: {
    backgroundColor: "#FF6B6B",
  },
  warningToast: {
    backgroundColor: "#FFB347",
  },
  infoToast: {
    backgroundColor: "#667eea",
  },
})
