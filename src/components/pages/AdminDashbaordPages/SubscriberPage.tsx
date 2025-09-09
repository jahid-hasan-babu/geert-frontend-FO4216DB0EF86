"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

const SubscriberPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("❌ No token found. Please login.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/all-subscriber`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = res.data;
      setSubscribers(data.data);
    } catch {
      setError("❌ Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const formatSerialNo = (index: number) => index + 1;

  return (
    <div className="min-h-screen bg-white p-6">

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-lg border mb-3 lg:mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20" data-translate>Serial No</TableHead>
              <TableHead data-translate>Email</TableHead>
              <TableHead data-translate>Subscribed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </TableCell>
              </TableRow>
            ) : subscribers.length > 0 ? (
              subscribers.map((subscriber, index) => (
                <TableRow key={subscriber.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{formatSerialNo(index)}</TableCell>
                  <TableCell className="text-gray-600">{subscriber.email}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(subscriber.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  No subscribers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriberPage;
