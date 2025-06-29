import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  modalCloseText: {
    color: '#007AFF',
    fontSize: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modelList: {
    padding: 16
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 12
  },
  modelItemSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#e3f2fd'
  },
  modelInfo: {
    flex: 1
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  modelDescription: {
    fontSize: 14,
    color: '#555'
  },
  checkContainer: {
    marginLeft: 12
  }
});