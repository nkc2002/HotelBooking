import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Building2, DoorOpen } from 'lucide-react';
import {
  hotelAmenities as initialHotelAmenities,
  roomAmenities as initialRoomAmenities,
  availableIcons,
  getIconComponent,
} from '../../data/amenities';

const AmenitiesManagement = () => {
  const [activeTab, setActiveTab] = useState('hotel');
  const [hotelAmenities, setHotelAmenities] = useState(initialHotelAmenities);
  const [roomAmenities, setRoomAmenities] = useState(initialRoomAmenities);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'wifi',
    description: '',
  });

  const currentAmenities = activeTab === 'hotel' ? hotelAmenities : roomAmenities;
  const setCurrentAmenities = activeTab === 'hotel' ? setHotelAmenities : setRoomAmenities;

  const filteredAmenities = currentAmenities.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingAmenity(null);
    setFormData({
      name: '',
      icon: 'wifi',
      description: '',
    });
    setShowModal(true);
  };

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      icon: amenity.icon,
      description: amenity.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tiện nghi này?')) {
      setCurrentAmenities(currentAmenities.filter((a) => a.id !== id));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingAmenity) {
      setCurrentAmenities(
        currentAmenities.map((a) =>
          a.id === editingAmenity.id ? { ...a, ...formData } : a
        )
      );
    } else {
      const newAmenity = {
        id: Date.now(),
        ...formData,
      };
      setCurrentAmenities([...currentAmenities, newAmenity]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý tiện nghi</h1>
          <p className="text-gray-500 mt-1">Quản lý tiện nghi khách sạn và phòng</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] transition-colors cursor-pointer"
        >
          <Plus size={20} />
          Thêm tiện nghi
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => {
            setActiveTab('hotel');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'hotel'
              ? 'bg-white text-[#FF385C] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 size={18} />
          Tiện nghi khách sạn
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            activeTab === 'hotel' ? 'bg-[#FF385C]/10 text-[#FF385C]' : 'bg-gray-200 text-gray-600'
          }`}>
            {hotelAmenities.length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('room');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'room'
              ? 'bg-white text-[#FF385C] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DoorOpen size={18} />
          Tiện nghi phòng
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            activeTab === 'room' ? 'bg-[#FF385C]/10 text-[#FF385C]' : 'bg-gray-200 text-gray-600'
          }`}>
            {roomAmenities.length}
          </span>
        </button>
      </div>

      {/* Description */}
      <div className={`p-4 rounded-xl ${activeTab === 'hotel' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'}`}>
        <div className="flex items-start gap-3">
          {activeTab === 'hotel' ? (
            <Building2 size={20} className="text-blue-600 mt-0.5" />
          ) : (
            <DoorOpen size={20} className="text-purple-600 mt-0.5" />
          )}
          <div>
            <h3 className={`font-medium ${activeTab === 'hotel' ? 'text-blue-900' : 'text-purple-900'}`}>
              {activeTab === 'hotel' ? 'Tiện nghi chung của khách sạn' : 'Tiện nghi riêng của phòng'}
            </h3>
            <p className={`text-sm mt-1 ${activeTab === 'hotel' ? 'text-blue-700' : 'text-purple-700'}`}>
              {activeTab === 'hotel'
                ? 'Các tiện nghi dùng chung cho toàn bộ khách sạn như: hồ bơi, gym, nhà hàng, spa, bãi đỗ xe...'
                : 'Các tiện nghi có trong từng phòng như: điều hòa, TV, minibar, ban công, view...'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm tiện nghi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
        />
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAmenities.map((amenity) => {
          const IconComponent = getIconComponent(amenity.icon);
          return (
            <div
              key={amenity.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${activeTab === 'hotel' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  <IconComponent
                    size={24}
                    className={activeTab === 'hotel' ? 'text-blue-600' : 'text-purple-600'}
                  />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(amenity)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer"
                    title="Sửa"
                  >
                    <Edit size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(amenity.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{amenity.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{amenity.description}</p>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAmenities.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            activeTab === 'hotel' ? 'bg-blue-100' : 'bg-purple-100'
          }`}>
            {activeTab === 'hotel' ? (
              <Building2 size={32} className="text-blue-400" />
            ) : (
              <DoorOpen size={32} className="text-purple-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? 'Không tìm thấy tiện nghi' : 'Chưa có tiện nghi nào'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : `Thêm tiện nghi ${activeTab === 'hotel' ? 'khách sạn' : 'phòng'} đầu tiên`}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] cursor-pointer"
            >
              <Plus size={18} />
              Thêm tiện nghi
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Hiển thị {filteredAmenities.length} / {currentAmenities.length} tiện nghi
        </p>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {activeTab === 'hotel' ? (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DoorOpen size={20} className="text-purple-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingAmenity ? 'Sửa tiện nghi' : 'Thêm tiện nghi mới'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeTab === 'hotel' ? 'Tiện nghi khách sạn' : 'Tiện nghi phòng'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tiện nghi
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  placeholder="VD: Wifi miễn phí, Hồ bơi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biểu tượng
                </label>
                <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                  {availableIcons.map((iconData) => {
                    const IconComp = iconData.icon;
                    const isSelected = formData.icon === iconData.id;
                    return (
                      <button
                        key={iconData.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, icon: iconData.id }))}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF385C] text-white'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                        title={iconData.label}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Đã chọn: {availableIcons.find((i) => i.id === formData.icon)?.label || 'Wifi'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] resize-none"
                  placeholder="Mô tả chi tiết về tiện nghi này..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] cursor-pointer"
                >
                  {editingAmenity ? 'Lưu thay đổi' : 'Thêm tiện nghi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitiesManagement;
