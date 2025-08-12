defmodule WebrtcServerWeb.RoomChannel do
  use Phoenix.Channel

  # Клиенты присоединяются к комнатам по ID
  def join("room:" <> room_id, _params, socket) do
    {:ok, assign(socket, :room_id, room_id)}
  end

  # Обработка SDP Offer от инициатора
  def handle_in(%{"offer" => %{"sdp" => sdp}}, socket) do
    broadcast!(socket, "offer", %{sdp: sdp})
    {:noreply, socket}
  end

  # Обработка SDP Answer от ответчика
  def handle_in(%{"answer" => %{"sdp" => sdp}}, socket) do
    broadcast!(socket, "answer", %{sdp: sdp})
    {:noreply, socket}
  end

  # Обработка ICE-кандидатов
  def handle_in(%{"candidate" => %{"candidate" => candidate}}, socket) do
    broadcast!(socket, "candidate", %{candidate: candidate})
    {:noreply, socket}
  end
end
